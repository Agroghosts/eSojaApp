import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
  ScrollView,
  Switch,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  View
} from 'react-native';
import * as yup from 'yup';
import { Button } from '../../../components/Button';
import { StepIndicator } from '../../../components/StepIndicator';
import { TextInput } from '../../../components/TextInput';
import Title from '../../../components/Title';
import { CreatePlotStepSixScreenRouteProps } from '../../../data/routes/app';
import { useSample } from '../../../hooks/useSample';
import { translate } from '../../../data/I18n';
import { Container, FormContainer, NextStepButton } from './styles';
import { PictureInput } from '../../../components/PictureInput';
import { useUpload } from '../../../hooks/useUpload';
import { Text } from 'react-native-paper';

const userLogin = yup.object().shape({
  grainsPlant1: yup
    .number()
    .required('Quantidade é obrigatória')
    .min(1, 'Quantidade de grãos não pode ser "ZERO"'),
  grainsPlant2: yup
    .number()
    .required('Quantidade é obrigatória')
    .min(1, 'Quantidade de grãos não pode ser "ZERO"')
});

export const CreatePlotStepSix: React.FC<CreatePlotStepSixScreenRouteProps> = ({
  navigation
}) => {
  const { saveStep, getPersistedData } = useSample();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(userLogin)
  });

  useEffect(() => {
    getPersistedData().then(data => {
      if (data) {
        setValue('grainsPlant1', data?.plantA?.grainsPlant1?.toString() || '');
        setValue('grainsPlant2', data?.plantA?.grainsPlant2?.toString() || '');
        setValue('description', data?.plantA?.description || '');
      }
    });
  }, [getPersistedData, setValue]);

  const handleSubmitStepSix = (data: FieldValues) => {
    const sample: any = {
      plantA: {
        grainsPlant1: data.grainsPlant1,
        grainsPlant2: data.grainsPlant2
      }
    };
    if (data?.description) {
      sample.plantA.description = data.description;
    }
    saveStep(sample);
    navigation.navigate('CreatePlotStepSeven');
  };
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState: any) => !previousState);
    setModalVisible(!isEnabled);
  };

  const [isEnabledB, setIsEnabledB] = useState(false);
  const toggleSwitchB = () => {
    setIsEnabledB((previousState: any) => !previousState);
    setModalVisible(!isEnabled);
  };

  const [image, setImage] = useState('');
  const { selectImage } = useUpload();
  const handleSelectImage = async () => {
    const uri = await selectImage();
    setImage(uri);
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView>
      <Container>
        <Title
          title={translate('CreatePlotStepSix.title')}
          subtitle={translate('CreatePlotStepSix.subtitle')}
        />
        <StepIndicator step={1} indicator={4} />
        <FormContainer>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Text> {translate('CreatePlotStepSix.labelSwitch')} </Text>
          {!isEnabled ? (
            <>
              <TextInput
                placeholder={translate('CreatePlotStepSix.samplePlaceholder')}
                label="CreatePlotStepSix.sampleA"
                icon="check-square"
                name="grainsPlant1"
                control={control}
                errorMessage={errors?.grainsPlant1?.message}
              />
            </>
          ) : (
            <View>
              <PictureInput
                placeholder="newProperty.propertyPictureLabel"
                updatePictureLabel="newProperty.propertyUpdatePictureLabel"
                onPress={handleSelectImage}
                uri={image}
              />
            </View>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Bota qualquer merda aqui pra servir de instrução</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Fechar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabledB ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchB}
            value={isEnabledB}
          />
          <Text> {translate('CreatePlotStepSix.labelSwitch')} </Text>

          {!isEnabledB ? (
            <TextInput
              label="CreatePlotStepSix.sampleB"
              placeholder={translate('CreatePlotStepSix.samplePlaceholder')}
              icon="check-square"
              name="grainsPlant2"
              control={control}
              errorMessage={errors?.grainsPlant2?.message}
            />
          ) : (
            <PictureInput
              placeholder="newProperty.propertyPictureLabel"
              updatePictureLabel="newProperty.propertyUpdatePictureLabel"
              onPress={handleSelectImage}
              uri={image}
            />
          )}
          <TextInput
            label="CreatePlotStepSix.sampleDescription"
            placeholder={translate(
              'CreatePlotStepSix.sampleDescriptionPlaceholder'
            )}
            icon="check-square"
            name="description"
            control={control}
          />
          <NextStepButton>
            <Button
              title="Continuar"
              onPress={handleSubmit(handleSubmitStepSix)}
            />
          </NextStepButton>
        </FormContainer>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: '#F194FF'
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  PictureInput: {
    alignItems: 'center'
  }
});
