import React, { useCallback } from 'react';
import { Group } from '@visx/group';
import { scaleLinear, scaleUtc, scaleTime} from '@visx/scale';
import { GridRows, GridColumns } from '@visx/grid';
import { AxisBottom, AxisLeft, AxisRight } from '@visx/axis';
import { LinePath, Line } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { withTooltip, useTooltip, useTooltipInPortal, TooltipWithBounds, Tooltip, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
// import { Text } from '@visx/text';
import { bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';

import './Userchart.css';

// ==================================================================================

// TEMP FAKE DATA
const userData: { 'date': string, 'weight': number, 'calories': number }[] = []
for (let i=1; i<=31; i++) {
    userData.push({
        date: i < 10 ? `01-0${i}-2021` : `01-${i}-2021`,
        weight: Math.floor(195 + Math.random() * 10 + i * 0.3),
        calories: Math.floor(2000 + Math.random() * 200 + i * 15)
    })
};
for (let i=1; i<=28; i++) {
    userData.push({
        date: i < 10 ? `02-0${i}-2021` : `02-${i}-2021`,
        weight: Math.floor(195 + Math.random() * 10 + (i + 31) * 0.3),
        calories: Math.floor(2000 + Math.random() * 200 + (i + 31) * 15)
    })
};

// UTILS, ACCESSORS
// =============================================================================

const formatDate = timeFormat("%b %d, '%y");

type TooltipData = typeof userData[0];
const getDate = (d: typeof userData[0]) => new Date(d.date);
const getCalories = (d: typeof userData[0]) => d.calories;
const bisectDate = bisector<typeof userData[0], Date>(d => new Date(d.date)).left;

export type AreaProps = {
    width: number,
    height: number
};

export default function Userchart () {
    const width = 1920 / 1.5;
    const height = 1080 / 1.5;

    
    // SCALING
    // =============================================================================

    const xScale = scaleTime({
        domain: [
            new Date(userData[0].date),
            new Date(userData[userData.length - 1].date)
        ],
        range: [0, width - 100],
    });

    const yScaleLeft = scaleLinear({
        domain: [
            Math.min(...userData.map(data => data.calories)) - 500,
            Math.max(...userData.map(data => data.calories)) + 500
        ],
        range: [height - 100, 0],
        round: true,
        nice: true
    });

    const yScaleRight = scaleLinear({
        domain: [
            Math.min(...userData.map(data => data.weight)) - 20,
            Math.max(...userData.map(data => data.weight)) + 20
        ],
        range: [height - 100, 0],
        round: true,
        nice: true
    });

    // TOOLTIPS
    // =============================================================================

    const {
        containerRef,
        containerBounds,
        TooltipInPortal
    } = useTooltipInPortal({
        scroll: true,
        detectBounds: true,
    });

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip<TooltipData>();

    const handleTooltip = useCallback(
        (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
            const { x } = localPoint(event) || { x: 0 };
            const x0 = xScale.invert(x);
            const index = bisectDate(userData, x0, 1);
            const d0 = userData[index - 4];
            const d1 = userData[index - 3];
            let d = d0;
            if (d1 && getDate(d1) && d0 && getDate(d0)) {
                d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
                showTooltip({
                    tooltipLeft: x,
                    tooltipTop: yScaleLeft(getCalories(d)) + 50,
                    tooltipData: d
                });
            };
        }, [showTooltip, xScale, yScaleLeft]
    );

    return (
        <div className="chart-wrapper">
            <svg className="chart" width={width} height={height} ref={containerRef} >
                <rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill={'#e8e8e8'}
                    rx={14}
                    onTouchStart={handleTooltip}
                    onTouchMove={handleTooltip}
                    onMouseMove={handleTooltip}
                    // onMouseOver={handleTooltip}
                    // onMouseLeave={() => hideTooltip()}
                />
                <Group top={50} left={50}>
                    <GridRows scale={yScaleLeft} width={width - 100} />
                    <GridColumns scale={xScale} height={height - 100} />
                    <AxisBottom top={height - 100} scale={xScale} numTicks={15} />
                    <AxisLeft scale={yScaleLeft} />
                    <AxisRight scale={yScaleRight} />
                    <text x="-75" y="30" transform="rotate(-90)" fontSize={18}>
                        Calories
                    </text>

                    {userData.map((data, index) => {
                        return (
                            <circle 
                                key={index}
                                r={3}
                                cx={xScale(new Date(data.date))}
                                cy={yScaleLeft(data.calories)}
                                stroke="rgba(33,33,33,1)"
                                fill="transparent"
                            />
                        )
                    })}
                    <LinePath
                        data={userData}
                        x={data => xScale(new Date(data.date))}
                        y={data => yScaleLeft(data.calories)}
                        curve={curveMonotoneX}
                        stroke="#222"
                        strokeWidth={1.5}
                    />
                </Group>

                {tooltipData && tooltipOpen && (
                    <>
                        <Line 
                            from={{ x: tooltipLeft, y: height - 50 }}
                            to={{ x: tooltipLeft, y: 50 }}
                            stroke={'#aaa'}
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                        <circle
                            cx={tooltipLeft}
                            cy={tooltipTop}
                            r={3}
                            fill={'black'}
                            pointerEvents="none"
                        />
                    </>
                )}
            </svg>

            {tooltipData && tooltipOpen && (
                <>
                    <TooltipInPortal
                        key={Math.random()}
                        top={tooltipTop}
                        left={tooltipLeft}
                        style={{
                            ...defaultStyles,
                            minWidth: 72,
                            textAlign: 'center'
                        }}
                    >
                        {getCalories(tooltipData)}
                    </TooltipInPortal>
                    <TooltipInPortal
                        key={Math.random()}
                        top={height - 25}
                        left={tooltipLeft ? tooltipLeft - 52 : tooltipLeft}
                        className='date-tooltip'
                    >
                        {formatDate(getDate(tooltipData))}
                    </TooltipInPortal>
                </>
            )}
        </div>
    )
};