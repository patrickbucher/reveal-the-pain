FROM golang:1.12.9-alpine AS builder
LABEL maintainer="Patrick Bucher <patrick.bucher@stud.hslu.ch>"
RUN apk add gcc libc-dev git 
COPY *.go go.mod go.sum /src/
WORKDIR /src
RUN go test && go build -o /app/reveal-the-pain

FROM alpine:3.10.2
LABEL maintainer="Patrick Bucher <patrick.bucher@stud.hslu.ch>"
COPY --from=builder /app/reveal-the-pain /bin/reveal-the-pain
ENV PORT="8000"
EXPOSE $PORT
CMD ["/bin/reveal-the-pain"]
