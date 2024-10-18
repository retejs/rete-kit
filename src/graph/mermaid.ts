import execa from 'execa'

export async function drawGraph(graphDefinition: string, output?: string) {
  await execa('npx', ['puppeteer', 'browsers', 'install', 'chrome-headless-shell'], {
    stdio: 'inherit'
  })
  await execa('npx', [
    '@mermaid-js/mermaid-cli',
    '-i', '-', // read from stdin
    '-o', output ?? 'output.svg'
  ], {
    input: graphDefinition
  })
}
