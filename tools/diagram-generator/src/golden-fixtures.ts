import { readFileSync } from "node:fs";

import { fourWayIntersectionSceneSchema } from "./schema";
import {
  renderCrosswalkTemplate,
  renderBicyclePassingTemplate,
  renderExpresswayMergeTemplate,
  renderExpresswayLanesTemplate,
  renderFourWayIntersectionTemplate,
  renderRailwayCrossingTemplate,
  renderNarrowLocalRoadTemplate,
  renderOneWayStreetTemplate,
  renderParkingRoadsideTemplate,
  renderStraightRoadTemplate,
  renderTJunctionTemplate,
  renderTollGateTemplate,
} from "./templates";

const d002 = fourWayIntersectionSceneSchema.parse(
  JSON.parse(
    readFileSync(new URL("../scenes/D002.json", import.meta.url), "utf8"),
  ),
);

export const GOLDEN_TEMPLATE_CASES = [
  {
    name: "T01-straight-road",
    svg: renderStraightRoadTemplate({
      id: "T01-golden",
      title: "Straight two-way road",
      description: "Two vehicles travel in opposite directions on a divided road.",
    }),
  },
  {
    name: "T02-four-way-intersection",
    svg: renderFourWayIntersectionTemplate(d002),
  },
  {
    name: "T03-t-junction",
    svg: renderTJunctionTemplate({
      id: "T03-golden",
      title: "T-junction",
      description: "A vehicle stops on the stem before entering the cross road.",
    }),
  },
  {
    name: "T04-crosswalk",
    svg: renderCrosswalkTemplate({
      id: "T04-golden",
      title: "Pedestrian crossing approach",
      description: "A vehicle approaches a marked crossing and stop line.",
    }),
  },
  {
    name: "T05-railway-crossing",
    svg: renderRailwayCrossingTemplate({
      id: "T05-golden",
      title: "Railway crossing approach",
      description: "A vehicle stops before railway tracks crossing the road.",
    }),
  },
  {
    name: "T06-expressway-merge",
    svg: renderExpresswayMergeTemplate({
      id: "T06-golden",
      title: "Expressway merge",
      description: "A merge ramp joins a two-lane main carriageway.",
    }),
  },
  {
    name: "T07-expressway-lanes",
    svg: renderExpresswayLanesTemplate({ id: "T07-golden", title: "Expressway lanes", description: "Two vehicles travel in separate same-direction expressway lanes." }),
  },
  {
    name: "T08-toll-gate",
    svg: renderTollGateTemplate({ id: "T08-golden", title: "Toll gate lanes", description: "A vehicle approaches a schematic set of toll lanes." }),
  },
  {
    name: "T09-parking-roadside",
    svg: renderParkingRoadsideTemplate({ id: "T09-golden", title: "Roadside parking", description: "A parked vehicle occupies the left roadside while another continues." }),
  },
  {
    name: "T10-one-way-street",
    svg: renderOneWayStreetTemplate({ id: "T10-golden", title: "One-way street", description: "Two vehicles travel in the same permitted direction." }),
  },
  {
    name: "T11-narrow-local-road",
    svg: renderNarrowLocalRoadTemplate({ id: "T11-golden", title: "Narrow local road", description: "A vehicle proceeds cautiously within a narrow unmarked road." }),
  },
  {
    name: "T12-bicycle-passing",
    svg: renderBicyclePassingTemplate({ id: "T12-golden", title: "Passing a cyclist", description: "A vehicle leaves space while passing a cyclist from the right." }),
  },
] as const;
