import './Welcome.css';

const Welcome = ({ firstName, lastName }) => (
    <h1 className="welcome-message">
        Welcome back, {firstName} {lastName}
    </h1>
);

export default Welcome; 