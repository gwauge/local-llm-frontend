# What is this?
This is a simple UI to showcase usability of local LLMs combined with a custom prompt as customer support agents for small and medium sized companies.

Created as part of the [Mittelstand-Digital](https://digitalzentrum-berlin.de/) project at [Hasso-Plattner-Institut](hpi.de)

# How to run

## run frontend using docker
```bash
docker compose up -d
```

## forward ollama server to localhost
```bash
ssh {OLLAMA_HOST} -L 0.0.0.0:11434:localhost:11434
```
### Note
Ollama requires a few env variables to be set. Specifcally:
- `OLLAMA_HOST=0.0.0.0:11434`
- optionally `OLLAMA_ORIGINS=http://localhost:*`

