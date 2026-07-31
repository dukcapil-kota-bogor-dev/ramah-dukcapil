package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func downloadTTS(filename, text string) error {

	if err := os.MkdirAll(filepath.Dir(filename), 0755); err != nil {
		return err
	}

	url := fmt.Sprintf("https://translate.google.com/translate_tts?ie=UTF-8&q=%s&tl=id&client=tw-ob",
		strings.ReplaceAll(text, " ", "%20"))

	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	out, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}
