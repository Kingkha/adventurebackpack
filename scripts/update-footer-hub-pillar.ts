import fs from 'node:fs'
import path from 'node:path'

const footerPath = path.join(process.cwd(), 'app', 'components', 'Footer.tsx')

const START = '{/* HUB_PILLAR_START */}'
const END = '{/* HUB_PILLAR_END */}'

function replaceBetweenMarkers(input: string, replacement: string): string {
  const startIdx = input.indexOf(START)
  const endIdx = input.indexOf(END)
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return input

  const startLineEnd = input.indexOf('\n', startIdx)
  const endLineStart = input.lastIndexOf('\n', endIdx) + 1

  if (startLineEnd === -1 || endLineStart === -1) return input

  const before = input.slice(0, startLineEnd + 1)
  const after = input.slice(endLineStart)
  return `${before}${replacement}\n${after}`
}

function main() {
  const src = fs.readFileSync(footerPath, 'utf8')

  if (!src.includes(START) || !src.includes(END)) {
    console.error(
      `Markers not found in ${footerPath}.\n` +
        `Expected to find ${START} and ${END}.\n` +
        `Re-run after updating Footer.tsx to include them.`
    )
    process.exit(1)
  }

  const replacement = `                          {(() => {
                            const hubPage = city.pillarArticles.find((post) =>
                              isHubPage(post, country.countrySlug, city.citySlug)
                            )

                            const pillarPage =
                              city.pillarArticles.find(
                                (post) =>
                                  !isHubPage(post, country.countrySlug, city.citySlug) && isPrimaryPillarPage(post)
                              ) ??
                              city.pillarArticles.find(
                                (post) => !isHubPage(post, country.countrySlug, city.citySlug)
                              )

                            return (
                              <div>
                                <p className="text-xs text-gray-400 mb-2">Key pages:</p>
                                <ul className="space-y-1">
                                  {hubPage ? (
                                    <li key={hubPage.slug}>
                                      <Link
                                        href={getHref(hubPage)}
                                        className="text-xs text-blue-300 hover:text-blue-200 hover:underline block"
                                      >
                                        Hub Page: {hubPage.title}
                                      </Link>
                                    </li>
                                  ) : null}

                                  {pillarPage ? (
                                    <li key={pillarPage.slug}>
                                      <Link
                                        href={getHref(pillarPage)}
                                        className="text-xs text-blue-300 hover:text-blue-200 hover:underline block"
                                      >
                                        Pillar Page: {pillarPage.title}
                                      </Link>
                                    </li>
                                  ) : null}

                                  {!hubPage && !pillarPage ? (
                                    <li className="text-xs text-gray-500">No hub or pillar pages available</li>
                                  ) : null}
                                </ul>
                              </div>
                            )
                          })()}`

  const next = replaceBetweenMarkers(src, replacement)
  if (next === src) {
    console.log('No changes needed.')
    return
  }

  fs.writeFileSync(footerPath, next, 'utf8')
  console.log(`Updated ${footerPath}`)
}

main()

