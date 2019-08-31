package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/go-redis/redis"
)

var client = redis.NewClient(&redis.Options{
	Addr:     "localhost:6379", // TODO: use environment variable from Docker
	Password: "",               // NOTE: no password is used currently
	DB:       0,                // NOTE: this is the default DB
})

func main() {
	http.HandleFunc("/hello", hello)
	http.HandleFunc("/redis", redisCanary)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	http.ListenAndServe(":"+port, nil)
}

func hello(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello, World!"))
}

func redisCanary(w http.ResponseWriter, r *http.Request) {
	pong, err := client.Ping().Result()
	if err != nil {
		message := fmt.Sprintf("ping redis: %v", err)
		http.Error(w, message, http.StatusInternalServerError)
	}
	w.Write([]byte(pong))
}
