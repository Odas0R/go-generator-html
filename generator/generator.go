package main

import (
	"fmt"
	"html/template"
	"os"
)

const (
	outDir       = "../dist"
	templatesDir = "../src/templates"
)

func main() {
	out, err := os.Create(outDir + "index.html")
	checkForErrors(err)
	defer out.Close()

	t, err := template.ParseGlob(templatesDir + "/*")
	checkForErrors(err)
	err = t.Execute(out, "")
	checkForErrors(err)
}

func checkForErrors(err error) {
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
