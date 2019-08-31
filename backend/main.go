package main

import (
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/hello", hello)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	http.ListenAndServe(":"+port, nil)
}

func hello(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello, World!"))
}
