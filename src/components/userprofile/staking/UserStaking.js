import React from "react";
import { stakingAPI } from "../../../api/api";
import { cryptocurrencyAPI } from "../../../api/cryptocurrencyAPI";
import StakingTable from "./StakingTable";


class UserStaking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStakings: [],
            completedStakings: [],
        };
    }

    async componentDidMount() {
        let active = [];
        let completed = [];

        const fetchStakingCoins = await stakingAPI.getUserStakings();
        console.log(fetchStakingCoins);
        fetchStakingCoins.map(async (coin) => {
            coin.name = cryptocurrencyAPI.getName(coin.stakingCoin.symbol);
            coin.image = cryptocurrencyAPI.getImage(coin.stakingCoin.symbol);

            if (coin.isCompleted === false)
                active.push(coin);
            else
                completed.push(coin);
        });

        this.setState({ activeStakings: active });
        this.setState({ completedStakings: completed });
    }


    render() {
        return (
            <div>
                <StakingTable stakings={this.state.activeStakings} />

                <StakingTable stakings={this.state.completedStakings} />
            </div>
        );
    }
}

export default UserStaking;
