package main

import (
	"fmt"
	"strings"
)

func logEmpty() {
	fmt.Println("no source data")
}

func logHeader() {
	fmt.Println("\n" + strings.Repeat("=", 40))
	fmt.Println("🚀 Generate sound :")
}

func logFooter(outputDir string, totalSuccess int, totalError int, totalPhrases int) {
	fmt.Println()
	fmt.Printf("generated at %s\n", outputDir)
	fmt.Printf("✅ Done %v/%v | ❌ Error %v\n", totalSuccess, totalPhrases, totalError)
	fmt.Println("\n" + strings.Repeat("=", 40))
}
