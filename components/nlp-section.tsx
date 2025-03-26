import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, ChevronDown, ChevronRight, Info } from "lucide-react"

export function NLPSection() {
  return (
    <section className="container mx-auto mt-12 px-4">
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Natural Language Analysis</h2>
            <p className="text-slate-600 mt-1">Advanced AI models analyzing antisemitic content patterns</p>
          </div>
        </div>

        {/* Topic Modeling Section - Outside Accordion */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Topic Modeling (LDA K=5)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Holocaust Denial & Distortion",
                percentage: "21.2%",
                tokens: ["hoax", "didn't happen", "Holohoax", "fake history", "revisionism"],
                metrics: {
                  similarity: "0.88",
                  examples: ["The Holocaust never happened", "Six million is a lie"]
                }
              },
              {
                title: "Violent Incitement",
                percentage: "17.4%",
                tokens: ["kill", "gas", "burn", "exterminate", "eradicate"],
                metrics: {
                  imperativeVerbs: "61.2%",
                  treeDepth: "4.2"
                }
              },
              {
                title: "Globalist Conspiracies",
                percentage: "29.5%",
                tokens: ["Rothschild", "puppet", "ZOG", "bankers", "cabal"],
                metrics: {
                  entities: {
                    "George Soros": "73%",
                    "Rothschild": "64%"
                  }
                }
              },
              {
                title: "Cultural Manipulation",
                percentage: "16.1%",
                tokens: ["media", "Hollywood", "agenda", "control", "brainwashing"],
                metrics: {
                  sarcasm: "22.4%",
                  sentenceLength: "13.7"
                }
              },
              {
                title: "Dehumanization Themes",
                percentage: "15.8%",
                tokens: ["rats", "vermin", "parasites", "infestation", "subhuman"],
                metrics: {
                  naziLanguage: "+3.6x",
                  emotionalIntensity: "0.89"
                }
              }
            ].map((topic, index) => (
              <Card key={index} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex justify-between items-center">
                    {topic.title}
                    <Badge variant="secondary" className="text-xs">{topic.percentage}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-xs font-medium mb-1">Top Tokens</h4>
                      <div className="flex flex-wrap gap-1">
                        {topic.tokens.map((token, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{token}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium mb-1">Metrics</h4>
                      <ul className="text-xs space-y-0.5">
                        {Object.entries(topic.metrics).map(([key, value]) => (
                          <li key={key}>• {key}: {typeof value === 'object' ? 
                            Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ') : 
                            value}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {/* Model Suite */}
          <AccordionItem value="model-suite">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Model Suite
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Hate Classification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• BERT-base-cased (F1 = 0.91)</li>
                      <li>• DistilBERT-hateX (precision: 0.93)</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sentiment & Emotion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• RoBERTa-large + VADER ensemble</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Topic Modeling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• LDA (K=5), coherence = 0.78</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Entity Extraction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• spaCy NER (en_core_web_trf)</li>
                      <li>• Custom Regex Gazetteers</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Clustering</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Agglomerative Hierarchical</li>
                      <li>• Silhouette score = 0.67</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Toxicity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Google Perspective API clone</li>
                      <li>• 87% agreement with human moderators</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Preprocessing Pipeline */}
          <AccordionItem value="preprocessing">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Preprocessing Pipeline
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Data Volume</h3>
                        <p className="text-sm">Total raw posts processed: 120,000</p>
                        <p className="text-sm">Language filtered: English only (87,320 posts retained)</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Filtering Results</h3>
                        <p className="text-sm">Spam/duplicate removal: 19.4%</p>
                        <p className="text-sm">Bot detection: 31.8% flagged as automated/semi-automated</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Hate Speech Classification */}
          <AccordionItem value="hate-classification">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Hate Speech Classification
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hate Category</TableHead>
                      <TableHead>% of Flagged Posts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>HS-V (Violent)</TableCell>
                      <TableCell>16.7%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>HS-D (Denialism)</TableCell>
                      <TableCell>22.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>HS-C (Conspiracy)</TableCell>
                      <TableCell>28.9%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>HS-DH (Dehumanization)</TableCell>
                      <TableCell>18.4%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>HS-M (Misinformation)</TableCell>
                      <TableCell>13.7%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Model Performance</h3>
                      <p className="text-sm">Avg. model confidence: 0.91</p>
                      <p className="text-sm">Multilabel overlap: 37.6% of posts</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sentiment & Toxicity */}
          <AccordionItem value="sentiment">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Sentiment & Toxicity Analysis
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sentiment Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Avg. compound sentiment: -0.86</li>
                      <li>• Posts below -0.90: 69.3%</li>
                      <li>• Subjectivity: μ = 0.81, σ = 0.09</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Emotion Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Anger: 62.5%</li>
                      <li>• Disgust: 44.1%</li>
                      <li>• Fear: 35.2%</li>
                      <li>• Trust: 2.1% (usually sarcastic)</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Toxicity Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Avg. toxicity score: 0.91</li>
                      <li>• Posts > 0.95: 48.7%</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Entity Analysis */}
          <AccordionItem value="entities">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Entity Analysis
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Persons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• George Soros: 5,221 mentions</li>
                      <li>• Adolf Hitler: 3,089 mentions</li>
                      <li>• Rothschild Family: 2,764 mentions</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Concepts/Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Zionists: 8,974 mentions</li>
                      <li>• Jewish media: 6,108 mentions</li>
                      <li>• Jewish bankers: 4,432 mentions</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Entity Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Soros: -0.93</li>
                      <li>• Rothschild: -0.88</li>
                      <li>• Zionists: -0.91</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Pattern Mining */}
          <AccordionItem value="patterns">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Pattern Mining & N-Grams
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Bigrams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• "kill Jews" (1.24% of hate tweets)</li>
                      <li>• "Jewish control"</li>
                      <li>• "gas them"</li>
                      <li>• "globalist cabal"</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Trigrams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• "Jews are evil"</li>
                      <li>• "Zionist occupied government"</li>
                      <li>• "Jewish puppet masters"</li>
                      <li>• "Protocols of Zion"</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Coded Language</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Detected in 12.3% of posts (e.g., "globalists" or "bankers" as dogwhistles)</p>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Stylometric Analysis */}
          <AccordionItem value="stylometric">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Stylometric Analysis
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Linguistic Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Readability (Flesch): 31.7</li>
                      <li>• Passive voice: 39.8%</li>
                      <li>• Sarcasm score: 0.42</li>
                      <li>• Lexical diversity (TTR): 0.61</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rhetorical Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Most common: rhetorical question + imperative verb ("Why don't you... gas them?")</p>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Coordinated Behavior */}
          <AccordionItem value="coordination">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Coordinated Behavior & Bot Analysis
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Bot & Account Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Bot tweets: 34.2%</li>
                      <li>• Sockpuppet accounts: 11.9%</li>
                      <li>• High-volume accounts: 8.7%</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Hashtag Clustering</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• #HolohoaxExposed: 0.71</li>
                      <li>• #ZionistAgenda: 0.64</li>
                      <li>• #JewishControl: 0.58</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Moderation Priorities */}
          <AccordionItem value="moderation">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Moderation Priorities
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>High Priority Phrases</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>"Gas the Jews"</li>
                      <li>"Kill all Jews"</li>
                      <li>"The Holocaust never happened"</li>
                      <li>"Jews are parasites"</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                <Alert variant="secondary">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Moderate Priority</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>"Jewish media control"</li>
                      <li>"Zionist cabal"</li>
                      <li>"Protocols of the Elders of Zion"</li>
                      <li>"Jewish bankers rule the world"</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Behavioral Clusters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• 17 clusters of coordinated users</li>
                      <li>• 3 clusters linked to Telegram</li>
                      <li>• 4 clusters linked to 4chan</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
} 