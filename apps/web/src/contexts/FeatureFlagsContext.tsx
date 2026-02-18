import React, { createContext, useContext, useState, useEffect } from 'react';

interface FeatureFlags {
    useSkillEngine: boolean;
    useBM25Search: boolean;
}

interface FeatureFlagsContextType {
    flags: FeatureFlags;
    toggleFlag: (flag: keyof FeatureFlags) => void;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [flags, setFlags] = useState<FeatureFlags>(() => {
        const saved = localStorage.getItem('designsys_feature_flags');
        return saved ? JSON.parse(saved) : {
            useSkillEngine: false,
            useBM25Search: true
        };
    });

    useEffect(() => {
        localStorage.setItem('designsys_feature_flags', JSON.stringify(flags));
    }, [flags]);

    const toggleFlag = (flag: keyof FeatureFlags) => {
        setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
    };

    return (
        <FeatureFlagsContext.Provider value={{ flags, toggleFlag }}>
            {children}
        </FeatureFlagsContext.Provider>
    );
};

export const useFeatureFlags = () => {
    const context = useContext(FeatureFlagsContext);
    if (context === undefined) {
        throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
    }
    return context;
};
