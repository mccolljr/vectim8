package main

import (
	"fmt"
	"io/fs"
	"net/http"
	"os"
)

func main() {
	args := ParseArguments()

	if err := run(args); err != nil {
		fmt.Fprintln(os.Stderr, "FATAL:", err)
		os.Exit(-1)
	}
}

func run(args *Arguments) error {
	var staticFiles fs.FS
	if args.Mode == ProductionMode {
		panic("TODO")
	} else {
		staticFiles = os.DirFS("./ui/dist/")
	}

	http.Handle("/", http.FileServerFS(staticFiles))

	fmt.Println("listening on http://localhost:8080/")
	return http.ListenAndServe(":8080", nil)
}
