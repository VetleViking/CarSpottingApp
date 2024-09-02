import React from "react";

const AskAi = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="fixed bottom-0 right-0 bg-white p-4">
            {open ? <div className="">

            </div> : <div >

            </div>}
        </div>
    );
};

export default AskAi;