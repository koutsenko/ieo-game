import React from "react";

import getTodayInstrument from "common/selectors/todayInstrument";
import { fmt } from "common/utils/money";
import costDelta from "common/selectors/costDelta";
import CostWithDelta from "client/components/CostWithDelta";

/**
 * У крипты нет дивидендов по-определению
 */
const buildCryptoColumnData = ({ data: { id, orderedTurnState, name } }) => {
  const { avgBuyCosts, defaultInstrDigits } = orderedTurnState;
  const asset = orderedTurnState.assets.find(a => a.id === id);
  const value = asset === undefined ? 0 : `${asset.count} pcs`;
  const ins = getTodayInstrument(orderedTurnState, id);

  if (ins === undefined) {
    return null;
  }

  const meta = orderedTurnState.instruments.meta[id];
  const { digits } = meta.static_params;
  const dig = digits !== undefined ? parseInt(digits) : defaultInstrDigits;

  const avgBuyCost = fmt(avgBuyCosts[id], dig) || 0;
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
    "",
    value,
    avgBuyCost,
    fmt(sum, dig),
    id
  ];

  return data;
};

export default buildCryptoColumnData;
