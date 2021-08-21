import Loader from "react-loader-spinner";
import { usePromiseTracker } from "react-promise-tracker";

export const LoadingIndicator = (props) => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        promiseInProgress &&
        ((<h2>loading indicator here</h2>),
            (
                <div
                    style={{
                        width: "100%",
                        height: "100",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
                </div>
            ))
    );
};
