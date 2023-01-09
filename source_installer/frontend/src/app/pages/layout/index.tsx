import { ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app/store';
import ProgressBar from 'features/system/components/ProgressBar';
import SiteHeader from 'features/system/components/SiteHeader';
import Console from 'features/system/components/Console';
import ImageUploader from 'common/components/ImageUploader';

import FloatingOptionsPanelButtons from 'features/tabs/components/FloatingOptionsPanelButtons';
import FloatingGalleryButton from 'features/tabs/components/FloatingGalleryButton';

type LayoutProps = {
    children: ReactElement;
};

const Layout = ({ children }: LayoutProps) => {
    const auth = useSelector((state: RootState) => state.authReducer);
    const { isLoggedIn } = auth;

    return (
        <div className="layout">
            <ImageUploader>
                <ProgressBar />
                <div className="app-content">
                    <SiteHeader />
                    {children}
                </div>

                {isLoggedIn ?
                    <div className="app-console">
                        <Console />
                    </div> : ''}
            </ImageUploader>
            {isLoggedIn ? <FloatingOptionsPanelButtons /> : ''}
            {isLoggedIn ? <FloatingGalleryButton /> : ''}
        </div>
    )
}

export default Layout