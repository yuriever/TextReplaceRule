# [TextReplaceRule](https://github.com/yuriever/TextReplaceRule.git)

**Originally forked from [bhughes339/vscode-replacerules](https://github.com/bhughes339/vscode-replacerules). TextReplaceRule is now an independent extension.**

TextReplaceRule runs configurable text rewrites in VS Code from an external JSON or JSONC file.

## Setup

1. Create a config file.
2. Set `"text-replace-rule.configPath"` in `settings.json`.
3. Run one of these commands from the Command Palette:
    * `TextReplaceRule: Run Rule...`
    * `TextReplaceRule: Run Rule Pipeline...`

Notes:

* `configPath` supports explicit absolute paths and ordinary workspace-relative paths, including paths with spaces.
* A relative `configPath` resolves from the workspace folder containing the active document. In a multi-root workspace, each folder can provide its own resource-scoped value.
* A relative `configPath` cannot be used when the active document is outside every workspace folder.
* `~/` is not expanded. Use an explicit absolute path for configuration stored outside the workspace.
* JSONC comments and trailing commas are allowed.
* Changing `configPath` is picked up automatically.
* Editing the config file itself requires `Developer: Reload Window`.

## How A Run Works

* One empty selection processes the whole document.
* Non-empty selections are processed independently.
* One command run becomes one editor edit.
* CRLF line endings are preserved.

## Config Shape

```jsonc
{
  "rules": {},
  "rulePipelines": {}
}
```

Optional metadata for rules and pipelines:

* `name`
* `description`

## `regexReplace`

```jsonc
{
  "type": "regexReplace",
  "find": "foo",
  "replace": "bar",
  "flag": "g",
  "post": []
}
```

* `find`: string or non-empty string array
* `replace`: string or string array aligned with `find`; missing means delete the match
* `flag`: string or string array aligned with `find`; missing defaults to `g`
* `language`: optional array of VS Code language ids
* `post`: optional array of post processors

Behavior:

* Array `find` values run in order as one rule.
* `post` runs once after the full rule finishes.
* Replacement strings use normal JavaScript replacement tokens such as `$1`, `$&`, and `$$`.
* Add `m` explicitly when `^` or `$` should match line boundaries.

## `literalMap`

```jsonc
{
  "type": "literalMap",
  "map": {
    ":ok:": "[done]"
  },
  "post": []
}
```

* `map`: object from literal source text to literal replacement text
* `language`: optional array of VS Code language ids
* `post`: optional array of post processors

Behavior:

* Keys must be non-empty.
* Keys cannot overlap by prefix. For example, `a` and `ab` together are rejected.
* Values are inserted literally. `$1` and `$&` are not expanded.

## `rulePipelines`

```jsonc
{
  "rules": ["first-rule", "second-rule"]
}
```

* Listed rules run in order.
* Missing rule references are rejected when the config loads.
* Language-restricted rules are skipped when the active editor language does not match.

## Post Processors

`post` is an array. Processors run in listed order.

* `"expandTab"`: replace tabs with spaces using the active editor `tabSize`
* `"removeBlankLine"`: remove blank and whitespace-only lines
* `{ "type": "indentLine", "mode": "block" | "inline" | "auto" }`

`indentLine` modes:

* `block`: if everything before the selection start on that line is whitespace, later lines inherit that exact prefix
* `inline`: later lines align to the selection start column; non-whitespace before the selection is treated as spaces
* `auto`: use `block` for whitespace-only prefixes, otherwise use `inline`

Recommended order for multiline formatting:

```jsonc
[
  { "type": "indentLine", "mode": "auto" },
  "expandTab",
  "removeBlankLine"
]
```

## Example

```jsonc
{
  "rules": {
    "trim-trailing-space": {
      "type": "regexReplace",
      "find": "[ \\t]+$",
      "replace": "",
      "flag": "gm"
    },
    "latex-wrap-equation": {
      "type": "regexReplace",
      "find": "^(.*)$",
      "replace": "\\begin{equation}\\n\\t$1\\n\\end{equation}",
      "post": [
        { "type": "indentLine", "mode": "block" },
        "expandTab"
      ]
    },
    "latex-inline-lr": {
      "type": "regexReplace",
      "find": "^\\((.*)\\)$",
      "replace": "\\foo{\\n\\t$1\\n}",
      "post": [
        { "type": "indentLine", "mode": "inline" },
        "expandTab",
        "removeBlankLine"
      ]
    },
    "status-keywords": {
      "type": "literalMap",
      "map": {
        ":ok:": "[done]",
        ":warn:": "[needs-review]"
      }
    }
  },
  "rulePipelines": {
    "markdown-cleanup": {
      "rules": ["trim-trailing-space", "status-keywords"]
    }
  }
}
```
