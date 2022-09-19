import React from "react";
import Title from '../../components/Title';
import { ImageUploadScreenRouteProps } from "../../data/routes/app";
import { Container, Header} from "../NewProperty/styles";
import { AddButton, Icon } from "../Plots/styles";
import { translate } from '../../data/I18n';

export const ImageUpload: React.FC<ImageUploadScreenRouteProps> = ({ navigation }) => {
    return (
        <Container>
            <Header>
                <Title
                    title={translate('imageUpload.imageUpload')}
                    subtitle={translate('imageUpload.VisualizeImages')}
                />
            </Header>
            <AddButton onPress={() => navigation.navigate('NewImage')}>
                <Icon name="plus" />
            </AddButton>
        </Container>
    )
}