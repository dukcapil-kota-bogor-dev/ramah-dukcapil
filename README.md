# Ramah Dukcapil

## Generate Sound

if using [taskfile](https://taskfile.dev/)

### Flags

#### jsonpath

source of jsonpath **[REQUIRED]**

using `-jsonpath`

example

```shell
go run ./ -jsonpath="./source-example.json"
```

### Testing

for testing, run

```shell
task dev
```

or

```shell
go run ./ -jsonpath="./source-example.json"
```

### Build

for build, run

```shell
task build
```

or

```shell
go build -o ./dist/generate.exe ./
```

### Json ready to use

you can run in testing mode, using

```shell
go run ./ -jsonpath="./source-ready-to-use.json"
```

this will generate all sound file ready to use (copy & paste to `sounds` folder)

copy all folders inside `[root]/generate/generated/[copy all folders here]` to `[root]/sounds/[paste here]`