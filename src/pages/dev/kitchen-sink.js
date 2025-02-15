import React, { useReducer, useState } from "react"
import CandidateStatsRow from "../../components/CandidateStatsRow"
import DesktopScoreBar from "../../components/DesktopScoreBar"
import ElectionMap from "../../components/ElectionMap"
import MainLayout from "../../components/MainLayout"
import NationwideSummaryHeader from "../../components/NationwideSummaryHeader"
import PartyStatsList from "../../components/PartyStatsList"
import { getMockDesktopScoreBarData } from "../../components/__fixtures__/DesktopScoreBarMockData"
import {
  getRandomScoreBarData,
  useRandomScoreBarData,
} from "../../components/__fixtures__/DesktopScoreBarRandomData"
import { getMockPartyStatsNationwide } from "../../components/__fixtures__/PartyStatsMockData"

function kitchenSink(gallery, example) {
  // @todo #1 Add kitchen sink for CompactScoreBar
  gallery("Home Page Redirect", () => {
    function RedirectSettings() {
      const [, setRenderCount] = useState(0)
      const redirectFlag =
        typeof window !== "undefined" &&
        !window.localStorage.SKIP_ELECT_REDIRECT
      const toggle = () => {
        localStorage.SKIP_ELECT_REDIRECT = redirectFlag ? "1" : ""
        setRenderCount(x => x + 1)
      }
      return (
        <div css={{ padding: 16 }}>
          Redirect is <strong>{redirectFlag ? "ON" : "OFF"}</strong>{" "}
          <button onClick={toggle}>Toggle</button>
        </div>
      )
    }
    example("Settings", { maxWidth: 320 }, () => <RedirectSettings />)
  })

  gallery("DesktopScoreBar", () => {
    example("Blank", { maxWidth: 960 }, () => <DesktopScoreBar data={[]} />)

    function MockDesktopScoreBarWithRandomData() {
      const data = useRandomScoreBarData()
      return <DesktopScoreBar data={data} />
    }
    example("Random data", { maxWidth: 960 }, () => (
      <MockDesktopScoreBarWithRandomData />
    ))

    function MockDesktopScoreBarWithRandomButton() {
      const [data, randomize] = useReducer(
        () => getRandomScoreBarData(0.5),
        getRandomScoreBarData(0.5)
      )
      return (
        <div>
          <DesktopScoreBar data={data} />
          <button onClick={randomize}>Randomize!</button>
        </div>
      )
    }
    example("Random data with button", { maxWidth: 960 }, () => (
      <MockDesktopScoreBarWithRandomButton />
    ))

    example("Mock data - all seats filled", { maxWidth: 960 }, () => (
      <DesktopScoreBar data={getMockDesktopScoreBarData(1)} />
    ))
  })

  gallery("ElectionMap", () => {
    example("Blank Election Map", { maxWidth: 375 }, () => <ElectionMap />)
  })

  gallery("NationwideSummaryHeader", () => {
    const headerData = {
      totalZoneCount: 350,
      completedZoneCount: 202,
      totalVoteCount: 17452385,
      eligibleVoterCount: 51427890,
    }

    example("Loading", { maxWidth: 320 }, () => (
      <div style={{ padding: 16 }}>
        <NationwideSummaryHeader loading={true} {...headerData} />
      </div>
    ))
    example("Loaded", { maxWidth: 320 }, () => (
      <div style={{ padding: 16 }}>
        <NationwideSummaryHeader loading={false} {...headerData} />
      </div>
    ))
  })

  gallery("PartyStatsList", () => {
    const mockPartyStats = getMockPartyStatsNationwide()
    example(
      "List of parties",
      { maxWidth: 320, height: 400, scrollable: true },
      () => (
        <div style={{ padding: 16 }}>
          <PartyStatsList partyStats={mockPartyStats} />
        </div>
      )
    )
  })

  gallery("CandidateStatsRow", () => {
    example(
      "Basic example",
      {
        maxWidth: 320,
      },
      () => <CandidateStatsRow />
    )
  })
}

export default () => {
  const sections = []
  let currentSection
  kitchenSink(
    (title, f) => {
      const section = { title, examples: [] }
      sections.push(section)
      currentSection = section
      try {
        f()
      } finally {
        currentSection = null
      }
    },
    (title, options, render) => {
      currentSection.examples.push({ title, render, options })
    }
  )
  return (
    <MainLayout>
      <h1>Kitchen Sink</h1>
      {sections.map(s => (
        <Gallery key={s.title} title={s.title}>
          {s.examples.map((ex, i) => (
            <Example key={i} title={ex.title} {...ex.options || {}}>
              {ex.render()}
            </Example>
          ))}
        </Gallery>
      ))}
    </MainLayout>
  )
}

function Gallery({ title, children }) {
  return (
    <div>
      <h2
        id={title}
        css={{
          margin: 0,
          padding: "1rem",
          background: "#F0324B",
          color: "white",
        }}
      >
        {title}
      </h2>
      <div
        css={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "top",
          justifyContent: "center",
          background: "#ccc",
          padding: "4px 0",
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Example({ title, maxWidth, height, scrollable, children }) {
  const borderWidth = 4
  return (
    <div
      css={{
        display: "flex",
        flex: `${maxWidth + 2 * borderWidth}px 0 1`,
        padding: `${borderWidth}px 0`,
        justifyContent: "center",
      }}
    >
      <div
        css={{
          background: "white",
          flex: 1,
          maxWidth: maxWidth,
          overflow: "hidden",
        }}
      >
        <h3 css={{ margin: 0, background: "#ddd" }}>{title}</h3>
        <div
          style={{
            height,
            ...(scrollable
              ? {
                  overflowX: "hidden",
                  overflowY: "auto",
                  WebkitOverflowScrolling: "touch",
                }
              : { overflow: "hidden" }),
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
