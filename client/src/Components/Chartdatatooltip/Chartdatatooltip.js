import './Chartdatatooltip.css';

export default function Chartdatatooltip(props) {
    return (
        <div className="data-tooltip-content-wrapper">
            <h5 className="data-tooltip-data-title">Calories</h5>
            <p className="data-tooltip-data">{props.calories} kcal</p>
            <h5 className="data-tooltip-data-title">Weight</h5>
            <p className="data-tooltip-data">{props.weight} lbs</p>
            <h5 className="data-tooltip-data-title">Macro Nutrients</h5>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{width: '50%', textAlign: 'end', paddingRight: '3px'}}>
                    <p className="data-tooltip-data-last">xxxxx </p>
                    <p className="data-tooltip-data-last">xxxxx </p>
                    <p className="data-tooltip-data-last">xxxxx </p>
                </div>
                <div style={{width: '50%', textAlign: 'start', paddingLeft: '3px'}}>
                    <p className="data-tooltip-data-last">g protein</p>
                    <p className="data-tooltip-data-last">g fats</p>
                    <p className="data-tooltip-data-last">g carbs</p>
                </div>
            </div>
        </div>
    )
}