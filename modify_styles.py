import sys

with open('src/styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace red gradient in logo
content = content.replace(
    'linear-gradient(180deg, rgba(52, 13, 13, 0.98), rgba(24, 6, 6, 0.98))',
    'linear-gradient(180deg, rgba(20, 20, 20, 0.98), rgba(5, 5, 5, 0.98))'
)

# Replace eyebrow-pill
import re
pattern = re.compile(r'\.eyebrow-pill \{.*?\n\}', re.DOTALL)
new_pill = '''\.eyebrow-pill {
  padding: 0.45rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}'''

content = pattern.sub(new_pill.replace('\\.', '.'), content)

with open('src/styles.css', 'w', encoding='utf-8') as f:
    f.write(content)
print('Styles updated successfully.')
