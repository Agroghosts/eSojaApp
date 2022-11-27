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
import axios from 'axios';

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
  const [imageb, setImageB] = useState('');
  const { selectImage } = useUpload();
  const [ numberPods, setNumberPods] = useState(''); 
  const [ numberSeeds, setNumberSeeds] = useState(''); 
  const [ numberPodsb, setNumberPodsB] = useState(''); 
  const [ numberSeedsb, setNumberSeedsB] = useState(''); 
  const handleSelectImage = async () => {
    const uri = await selectImage();
    setImage(uri);

    let formData = new FormData();
    formData.append('imagefile', image);
    
    const resp = await axios.post('http://10.0.2.2:5000/getPods', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => {
      setNumberPods(res.data.foundPods);
      setNumberSeeds(res.data.seedsInSoy);
  });
  };
  const handleSelectImageB = async () => {
    const uri = await selectImage();
    setImageB(uri);

    let formData = new FormData();
    formData.append('imagefile', imageb);
    
    const resp = await axios.post('http://10.0.2.2:5000/getPods', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => {
      setNumberPodsB(res.data.foundPods);
      setNumberSeedsB(res.data.seedsInSoy);
  });
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
            <View style={styles.centeredView}>
              <PictureInput
                placeholder="newProperty.propertyPictureLabel"
                updatePictureLabel="newProperty.propertyUpdatePictureLabel"
                onPress={handleSelectImage}
                uri={image}
              />
              <Text>{numberPods} { numberPods ? translate('CreatePlotStepSix.foundPods') : ''}</Text>
              <Text>{numberSeeds} { numberSeeds ? translate('CreatePlotStepSix.foundSeeds'): ''}</Text>
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
                <Text style={styles.modalTitle}>
                    INSTRUÇÕES
                </Text>
                <Text style={styles.modalText}>
                  - Tire ou selecione uma foto com boa qualidade {'\n'}
                  - A planta deve estar a pelo menos 2 metros de distância {'\n'}
                  - A foto deve conter a planta inteira {'\n'}
                  - As vagens devem estar visíveis
                </Text>
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
            <View style={styles.centeredView}>
              <PictureInput
                placeholder="newProperty.propertyPictureLabel"
                updatePictureLabel="newProperty.propertyUpdatePictureLabel"
                onPress={handleSelectImageB}
                uri={imageb}
              />
              <Text>{numberPodsb} { numberPodsb ? translate('CreatePlotStepSix.foundPods'): ''}</Text>
              <Text>{numberSeedsb} { numberSeedsb ? translate('CreatePlotStepSix.foundSeeds'): ''}</Text>
            </View>
          ) 
          }
         
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
    textAlign: 'left'
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  PictureInput: {
    alignItems: 'center'
  }
});
