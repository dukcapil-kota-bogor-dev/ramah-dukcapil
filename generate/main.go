package main

import (
	"flag"
	"fmt"
	"log"
	"path/filepath"
)

var jsonFilePath string

func init() {
	flag.StringVar(&jsonFilePath, "jsonpath", "", "json path")

	flag.Parse()
}

func main() {

	if jsonFilePath == "" {
		logEmpty()
		return
	}

	sourceFile, err := getSourceFile(jsonFilePath)
	if err != nil {
		log.Fatalln(err)
	}

	logHeader()

	totalSuccess := 0

	jsonData := JsonData{
		Files:     make([]string, 0),
		Generated: make(map[string]string),
	}

	for _, phrase := range sourceFile.Phrases {
		filename := fmt.Sprintf("%s.%s", phrase.Filename, sourceFile.Filetype)
		path := filepath.Join(sourceFile.Output, filename)
		if err := downloadTTS(path, phrase.Text); err != nil {
			fmt.Printf("❌ Error %s | %v\n", path, err)
		} else {
			fmt.Printf("♻️ Done %s\n", path)
			jsonData.Files = append(jsonData.Files, filename)
			jsonData.Generated[filename] = phrase.Text
			totalSuccess++
		}
	}

	toJsonFile(filepath.Join(sourceFile.Output, "generated.json"), jsonData)

	totalError := len(sourceFile.Phrases) - totalSuccess

	logFooter(
		sourceFile.Output,
		totalSuccess,
		totalError,
		len(sourceFile.Phrases),
	)
}
