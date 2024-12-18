import { useParams } from "react-router-dom";

const Onboarding = () => {
    const { id } = useParams();

    return (
        <>
            <h2>Let's get started, {id}</h2>
            <p>This is the onboarding view</p>
        </>
    );
};

export default Onboarding;