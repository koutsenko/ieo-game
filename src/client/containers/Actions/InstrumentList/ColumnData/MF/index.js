import React from "react";

import getTodayInstrument from "common/selectors/todayInstrument";
import { fmt, trimDigits } from "common/utils/money";
import getFirstKnownInstrument from "common/selectors/firstKnownInstrument";
import costDelta from "common/selectors/costDelta";
import CostWithDelta from "client/components/CostWithDelta";

const buildMFColumnData = ({ data: { id, orderedTurnState, name } }) => {
  const { avgBuyCosts, defaultInstrDigits } = orderedTurnState;
  const asset = orderedTurnState.assets.find(a => a.id === id);
  const value = asset === undefined ? 0 : `${asset.count} pcs`;
  const ins = getTodayInstrument(orderedTurnState, id);

  if (ins === undefined) {
    return null;
  }

  const currentCost = parseFloat(ins.cost);

  const meta = orderedTurnState.instruments.meta[id];
  const { digits } = meta.static_params;
  const dig = digits !== undefined ? parseInt(digits) : defaultInstrDigits;

  const avgBuyCost = fmt(avgBuyCosts[id], dig) || 0;

  const firstKnownIns = getFirstKnownInstrument(orderedTurnState, id);
  const yeld = (100 * currentCost) / parseFloat(firstKnownIns.cost);
  const formattedYeld = `${trimDigits(yeld, 0)} %`;
  const sum = parseFloat(ins.cost) * (asset === undefined ? 0 : asset.count);

  const data = [
    name,
    <CostWithDelta
      {...{
        cost: ins.cost,
        delta: fmt(costDelta(orderedTurnState, id), dig),
        digits: dig
      }}
    />,
    formattedYeld,
    value,
    avgBuyCost,
    fmt(sum, dig),
    id
  ];

  return data;
};

export default buildMFColumnData;
