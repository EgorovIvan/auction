import React from 'react';
import './Home.scss';
import NavigationBar from '../../components/NavigationBar/NavigationBar.tsx';
import HeroSection from '../../components/HeroSection/HeroSection.tsx';
import InfoSection from '../../components/InfoSection/InfoSection.tsx';
import Footer from '../../components/Footer/Footer.tsx';

const Home: React.FC = () => {
    return (
        <div className="home">
            <NavigationBar />
            <HeroSection />
            <InfoSection />
            <Footer />
        </div>
    );
};

export default Home;