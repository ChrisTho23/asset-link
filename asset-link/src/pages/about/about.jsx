import './about.css';
import { icons } from '../../assets/icons';
import BackgroundPattern from '../../components/BackgroundPattern/BackgroundPattern';

const About = () => {
    return (
        <div className="about-page">
            <BackgroundPattern />
            <h1>
                About Asset Link
            </h1>

            <section className="introduction">
                <h2>
                    {icons.find(i => i.id === 'net-worth').icon}
                    Track Your Complete Net Worth
                </h2>
                <p>
                    Asset Link is a comprehensive platform designed to help you track and manage your entire net worth in one place.
                    While traditional banking apps only show your cash holdings, modern investors often have their wealth spread across
                    various asset classes - from stocks and cryptocurrencies to precious metals and real estate.
                </p>
            </section>

            <section className="problem-solution">
                <h2>
                    {icons.find(i => i.id === 'info').icon}
                    Why Asset Link?
                </h2>
                <p>
                    Managing multiple assets across different platforms can make it challenging to maintain a clear picture of your
                    total net worth. Whether you're holding cryptocurrencies in hardware wallets, precious metals in physical storage,
                    or investments across multiple brokers, Asset Link provides a unified dashboard for all your assets.
                </p>
            </section>

            <section className="features">
                <h2>
                    {icons.find(i => i.id === 'asset-list').icon}
                    Key Features
                </h2>
                <ul>
                    <li>
                        <div>
                            <strong>Real-time Asset Tracking</strong>
                            Automatically updates prices for stocks, cryptocurrencies, and precious metals
                        </div>
                    </li>
                    <li>
                        <div>
                            <strong>Comprehensive Asset Support</strong>
                            Track multiple asset classes including:
                            <ul>
                                <li>{icons.find(i => i.id === 'stock').icon} Stocks</li>
                                <li>{icons.find(i => i.id === 'crypto').icon} Cryptocurrencies</li>
                                <li>{icons.find(i => i.id === 'precious_metals').icon} Precious Metals</li>
                                <li>{icons.find(i => i.id === 'real_estate').icon} Real Estate</li>
                                <li>{icons.find(i => i.id === 'equity').icon} Private Equity</li>
                                <li>{icons.find(i => i.id === 'cash').icon} Cash Holdings</li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div>
                            <strong>Visual Analytics</strong>
                            View your asset distribution through interactive charts and track your net worth history over time
                        </div>
                    </li>
                    <li>
                        <div>
                            <strong>Secure Management</strong>
                            Edit, update, and manage your assets with a user-friendly interface while your data is kept secure and only accessible to you!
                        </div>
                    </li>
                </ul>
            </section>

            <section className="getting-started">
                <h2>
                    {icons.find(i => i.id === 'info').icon}
                    Getting Started
                </h2>
                <p>
                    Create an account to start tracking your assets today. Simply add your assets, and Asset Link will help you
                    maintain an up-to-date view of your total net worth with real-time price updates for supported assets.
                </p>
            </section>

            <section className="credits">
                <h2>Credits</h2>
                <p>
                    Asset Link was created by <a href="https://christophethomassin.com" target="_blank" rel="noopener noreferrer">Christophe Thomassin</a>.
                    View the source code on <a href="https://github.com/ChrisTho23/asset-link" target="_blank" rel="noopener noreferrer">GitHub</a>.
                </p>
            </section>
        </div>
    );
};

export default About;