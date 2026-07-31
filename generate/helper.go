package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
)

func getSourceFile(filePath string) (*SourceFile, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("Error while reading file on %s | %v", jsonFilePath, err))
	}

	var sourceFile SourceFile

	err = json.Unmarshal(data, &sourceFile)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("Error while convert json data | %v", err))
	}

	return &sourceFile, nil
}

func toJsonFile(outputFilename string, data JsonData) error {
	jsonByte, err := json.MarshalIndent(data, "", " ")
	if err != nil {
		return err
	}
	err = os.WriteFile(outputFilename, jsonByte, 0644)
	if err != nil {
		return err
	}
	return nil
}
