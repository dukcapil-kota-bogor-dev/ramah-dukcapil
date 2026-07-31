package main

type Phrase struct {
	Filename string `json:"filename"`
	Text     string `json:"text"`
}

type SourceFile struct {
	Filetype string   `json:"filetype"`
	Output   string   `json:"output"`
	Phrases  []Phrase `json:"phrases"`
}

type JsonData struct {
	Files     []string          `json:"files"`
	Generated map[string]string `json:"generated"`
}
