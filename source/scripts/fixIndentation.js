// Removes leading tabs and the last newline character from string

export default function (string) {
  const sortedString = string
    .split('\n')
    .sort()
  const matches = sortedString[sortedString.length - 1].match(/^\s*/)
  const numberOfTabs = matches ? matches[0].length : 0

  return string
    .split('\n')
    .map(line => line.substr(numberOfTabs))
    .join('\n')
    .slice(0, -1)
}
