import './Userdatainput.css';

export default function Userdatainput () {
    return (
    <form className="input-area-wrapper">
        <input type="date" className="date-picker" />
        <div className="input-line-item">
            <label for="weight-input">Weight</label>
            <input id="weight-input" type="number" step="0.01" />
        </div>
        <div className="input-line-item">
            <label for="calories-input">Calories Consumed</label>
            <input id="calories-input" type="number" step="1" />
        </div>
    </form>
    );
}