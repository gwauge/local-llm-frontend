# What is this?
This is a simple UI to showcase usability of local LLMs combined with a custom prompt as customer support agents for small and medium sized companies.

Created as part of the [Mittelstand-Digital](https://digitalzentrum-berlin.de/) project at [Hasso-Plattner-Institut](hpi.de)

# How to run

## run frontend using docker
```bash
docker compose up -d
```
in development mode, the server isn't started automatically so might need to run
```bash
npm run dev
```

## Ollama server
### run locally
```bash
ollama serve
```

### forward remote server using ssh
```bash
ssh {OLLAMA_HOST} -L 11434:localhost:11434
```
#### Note
Ollama requires a few env variables to be set. Specifcally:
- `OLLAMA_HOST=0.0.0.0:11434`
- optionally `OLLAMA_ORIGINS=http://localhost:*`


