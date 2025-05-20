package main

import (
	"flag"
	"fmt"
	"os"
)

type RunMode uint8

const (
	ProductionMode RunMode = iota
	DevelopmentMode
)

func (self RunMode) String() string {
	switch self {
	case ProductionMode:
		return "production"
	case DevelopmentMode:
		return "development"
	default:
		return fmt.Sprintf("RunMode<%d>", int(self))
	}
}

func (self RunMode) MarshalText() ([]byte, error) {
	return []byte(self.String()), nil
}

func (self *RunMode) UnmarshalText(v []byte) error {
	switch s := string(v); s {
	case "prod", "production", "p":
		*self = ProductionMode
		return nil
	case "dev", "devel", "development", "d":
		*self = DevelopmentMode
		return nil
	default:
		return fmt.Errorf("unknown RunMode: %q", s)
	}
}

type Arguments struct {
	Mode    RunMode
	Verbose bool
}

func ParseArguments() *Arguments {
	args := new(Arguments)

	flagSet := flag.NewFlagSet("vectim8", flag.ExitOnError)

	flagSet.TextVar(&args.Mode, "mode", ProductionMode,
		fmt.Sprint(ProductionMode, " or ", DevelopmentMode))

	flagSet.Parse(os.Args[1:])

	return args
}
