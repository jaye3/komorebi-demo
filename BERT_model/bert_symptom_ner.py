# To use the collab notebook (for Mac users): https://drive.google.com/file/d/1MoLPVEToOEMKWo_NIc_LyqcABQBBdG1X/view?usp=sharing

# # Install the packages
# !pip install torch transformers scikit-learn pandas
# !pip install torch transformers
# !pip install seqeval

import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer, AutoModelForTokenClassification, AdamW, get_scheduler, pipeline
from sklearn.model_selection import train_test_split
from seqeval.metrics import classification_report

# Define labels
"""
O: Outside Symptom
B-SYMPTOM: Beginning of Symptom
I-SYMPTOM: Inside Symptom
"""
label_list = ["O", "B-SYMPTOM", "I-SYMPTOM"]
label2id = {label: idx for idx, label in enumerate(label_list)}
id2label = {idx: label for label, idx in label2id.items()}

# Load ClinicalBERT tokenizer and model
model_name = "emilyalsentzer/Bio_ClinicalBERT"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(
    model_name,
    num_labels=len(label_list),
    id2label=id2label,
    label2id=label2id,
)

# Example dataset (replace with your dataset)
texts = [
    "Patient complains of severe headache and nausea.",
    "Experiencing fatigue and shortness of breath.",
    "No symptoms reported."
]

# Corresponding labels (length must align with tokenized text)
labels = [
    ["O", "O", "O", "B-SYMPTOM", "I-SYMPTOM", "O", "B-SYMPTOM", "O"],
    ["O", "B-SYMPTOM", "O", "B-SYMPTOM", "I-SYMPTOM", "I-SYMPTOM", "O"],
    ["O", "B-SYMPTOM", "O"]
]

# Split into train/test sets
train_texts, test_texts, train_labels, test_labels = train_test_split(
    texts, labels, test_size=0.33, random_state=42
)

# Custom Dataset class
class SymptomDataset(Dataset):
    def __init__(self, texts, labels):
        self.texts = texts
        self.labels = labels

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        words = self.texts[idx].split()

        encoding = tokenizer(
            words,
            is_split_into_words=True,
            truncation=True,
            padding='max_length',
            max_length=128,
            return_tensors='pt'
        )

        word_ids = encoding.word_ids(batch_index=0)
        label_ids = []
        previous_word_idx = None

        for word_idx in word_ids:
            if word_idx is None:
                label_ids.append(-100)
            elif word_idx != previous_word_idx:
                label_ids.append(label2id[self.labels[idx][word_idx]])
            else:
                label_ids.append(-100)
            previous_word_idx = word_idx

        return {
            'input_ids': encoding['input_ids'].squeeze(),
            'attention_mask': encoding['attention_mask'].squeeze(),
            'labels': torch.tensor(label_ids)
        }

# Prepare datasets and loaders
train_dataset = SymptomDataset(train_texts, train_labels)
test_dataset = SymptomDataset(test_texts, test_labels)

train_loader = DataLoader(train_dataset, batch_size=2, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=2)

# Device setup
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Device set to {device}")
model.to(device)

# Optimizer and scheduler
optimizer = AdamW(model.parameters(), lr=2e-5)

epochs = 5
scheduler = get_scheduler(
    "linear",
    optimizer=optimizer,
    num_warmup_steps=0,
    num_training_steps=len(train_loader) * epochs
)

# Training loop
for epoch in range(epochs):
    model.train()
    total_loss = 0

    for batch in train_loader:
        optimizer.zero_grad()

        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels_tensor = batch['labels'].to(device)

        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            labels=labels_tensor
        )

        loss = outputs.loss
        loss.backward()

        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        scheduler.step()

        total_loss += loss.item()

    avg_loss = total_loss / len(train_loader)
    print(f"Epoch {epoch + 1}/{epochs}, Loss: {avg_loss:.4f}")

# Evaluation
model.eval()
true_labels_list = []
pred_labels_list = []

with torch.no_grad():
    for batch in test_loader:
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels_tensor = batch['labels'].to(device)

        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask
        )

        predictions = torch.argmax(outputs.logits, dim=-1).cpu().numpy()
        labels_tensor_cpu = labels_tensor.cpu().numpy()

        for pred_seq, label_seq in zip(predictions, labels_tensor_cpu):
            true_seq, pred_seq_filtered = [], []
            for pred_id, label_id in zip(pred_seq, label_seq):
                if label_id != -100:
                    true_seq.append(id2label[label_id])
                    pred_seq_filtered.append(id2label[pred_id])

            true_labels_list.append(true_seq)
            pred_labels_list.append(pred_seq_filtered)

print("\nEvaluation Report:")
print(classification_report(true_labels_list, pred_labels_list))

# NER Pipeline for inference on new text
ner_pipeline = pipeline(
    "ner",
    model=model,
    tokenizer=tokenizer,
    aggregation_strategy="simple",
    device=0 if torch.cuda.is_available() else -1
)

# Inference
new_comment = "Patient reports persistent cough and mild fever."
results = ner_pipeline(new_comment)

print("\nExtracted Symptoms from new comment:")
for res in results:
    if 'SYMPTOM' in res['entity_group']:
        print(f"- {res['word']}: {res['entity_group']}")

# To run: in terminal run 'python bert_symptom_ner.py'
