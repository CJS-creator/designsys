import React from 'react';
import { monitor } from '@/lib/monitoring';
import {
    FiHome,
    FiSettings,
    FiUser,
    FiSearch,
    FiEdit,
    FiTrash2,
    FiPlus,
    FiMinus,
    FiChevronDown,
    FiChevronUp,
    FiChevronLeft,
    FiChevronRight,
    FiArrowRight,
    FiArrowLeft,
    FiEye,
    FiEyeOff,
    FiHeart,
    FiShare,
    FiLink,
    FiExternalLink,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiClock,
    FiStar,
    FiCode,
    FiImage,
    FiFile,
    FiFolder,
    FiSave,
    FiUpload,
    FiRefreshCw,
    FiPlay,
    FiPause,
    FiSun,
    FiMoon,
    FiMonitor,
    FiSmartphone,
    FiTablet,
    FiCamera,
    FiVideo,
    FiMic,
    FiMicOff,
    FiHeadphones,
    FiLock,
    FiUnlock,
    FiShield,
    FiAlertTriangle,
    FiInfo,
    FiLoader,
    FiCheck,
    FiX,
    FiCheckCircle,
    FiXCircle,
    FiHelpCircle,
    FiBell,
    FiBellOff,
    FiMessageSquare,
    FiMessageCircle,
    FiSend,
    FiInbox,
    FiArchive,
    FiTrash,
    FiFilter,
    FiSliders,
    FiTarget,
    FiAward,
    FiGift,
    FiTrendingUp,
    FiTrendingDown,
    FiBarChart,
    FiPieChart,
    FiActivity,
    FiCloud,
    FiCompass,
    FiMap,
    FiBookmark,
    FiBook,
    FiFileText,
    FiClipboard,
    FiScissors,
    FiPaperclip,
    FiCreditCard,
    FiShoppingCart,
    FiPackage,
    FiCoffee,
    FiSmile,
    FiFrown,
    FiMeh,
    FiThumbsUp,
    FiThumbsDown,
} from 'react-icons/fi';

// Centralized icon registry for consistent usage across the app
export const Icons = {
    // Navigation & UI
    home: FiHome,
    settings: FiSettings,
    user: FiUser,
    search: FiSearch,
    edit: FiEdit,
    delete: FiTrash2,
    add: FiPlus,
    remove: FiMinus,
    chevronDown: FiChevronDown,
    chevronUp: FiChevronUp,
    chevronLeft: FiChevronLeft,
    chevronRight: FiChevronRight,
    arrowRight: FiArrowRight,
    arrowLeft: FiArrowLeft,
    eye: FiEye,
    eyeOff: FiEyeOff,
    heart: FiHeart,
    share: FiShare,
    link: FiLink,
    externalLink: FiExternalLink,

    // Communication
    mail: FiMail,
    phone: FiPhone,
    message: FiMessageSquare,
    messageCircle: FiMessageCircle,
    send: FiSend,
    inbox: FiInbox,

    // Status & Feedback
    check: FiCheck,
    close: FiX,
    warning: FiAlertTriangle,
    info: FiInfo,
    error: FiXCircle,
    success: FiCheckCircle,
    loading: FiLoader,
    help: FiHelpCircle,
    bell: FiBell,
    bellOff: FiBellOff,

    // Actions
    download: FiSave,
    upload: FiUpload,
    save: FiSave,
    copy: FiClipboard,
    refresh: FiRefreshCw,
    archive: FiArchive,
    trash: FiTrash,

    // Media & Content
    image: FiImage,
    video: FiVideo,
    play: FiPlay,
    pause: FiPause,
    camera: FiCamera,
    mic: FiMic,
    micOff: FiMicOff,
    headphones: FiHeadphones,

    // Design & Development
    code: FiCode,
    file: FiFile,
    folder: FiFolder,
    bookmark: FiBookmark,
    book: FiBook,
    fileText: FiFileText,
    scissors: FiScissors,
    paperclip: FiPaperclip,

    // Data & Analytics
    barChart: FiBarChart,
    pieChart: FiPieChart,
    activity: FiActivity,
    trendingUp: FiTrendingUp,
    trendingDown: FiTrendingDown,
    filter: FiFilter,
    sliders: FiSliders,
    target: FiTarget,

    // Business & Finance
    creditCard: FiCreditCard,
    shoppingCart: FiShoppingCart,
    package: FiPackage,
    award: FiAward,
    gift: FiGift,
    star: FiStar,

    // Devices & Technology
    monitor: FiMonitor,
    smartphone: FiSmartphone,
    tablet: FiTablet,
    sun: FiSun,
    moon: FiMoon,
    lock: FiLock,
    unlock: FiUnlock,
    shield: FiShield,
    cloud: FiCloud,

    // Time & Calendar
    calendar: FiCalendar,
    clock: FiClock,

    // Emojis & Reactions
    smile: FiSmile,
    frown: FiFrown,
    meh: FiMeh,
    thumbsUp: FiThumbsUp,
    thumbsDown: FiThumbsDown,

    // Food & Drink
    coffee: FiCoffee,

    // Location & Navigation
    map: FiMap,
    mapPin: FiMapPin,
    compass: FiCompass,
} as const;

export type IconName = keyof typeof Icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number | string;
    className?: string;
}

// Main Icon component for consistent usage
export function Icon({ name, size = 16, className, ...props }: IconProps) {
    const IconComponent = Icons[name];

    if (!IconComponent) {
        monitor.warn(`Icon "${name}" not found in registry`);
        return null;
    }

    return (
        <IconComponent
            size={size}
            className={className}
            {...props}
        />
    );
}

// Utility function to get icon component directly (for advanced use cases)
export function getIcon(name: IconName) {
    return Icons[name];
}