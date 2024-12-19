import './NetWorthBox.css';

const NetWorthBox = ({ amount }) => (
    <div className="net-worth-box">
        <h3 className="section-title">Total Net Worth</h3>
        <div className="net-worth-content">
            <span className="net-worth-amount">${amount.toLocaleString()}</span>
        </div>
    </div>
);

export default NetWorthBox; 