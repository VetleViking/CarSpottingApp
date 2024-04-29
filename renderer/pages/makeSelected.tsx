import { useParams } from 'react-router-dom';

export default function MakeSelected() {
    const params = useParams<{ make: string }>();

    console.log(params.make);

    return (
        <div>
            <h1>Selected Make: {params.make}</h1>
            {/* Rest of your component UI */}
        </div>
    );
};