import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/image/osca-final.png"
            alt="OSCA Logo"
            className={`object-cover ${props.className || ''}`}
        />
    );
}
