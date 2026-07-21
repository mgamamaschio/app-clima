import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [localizacao, setLocalizacao] = useState(null);
  const [erro, setErro] = useState(null);
  const [clima, setClima] = useState(null);

  useEffect(() => {
    async function pedirPermissao() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErro('Permissão de localização negada');
        return;
      }

      let posicaoAtual = await Location.getCurrentPositionAsync({});
      setLocalizacao(posicaoAtual);
    }

    pedirPermissao();
  }, []);

  useEffect(() => {
    async function buscarClima() {
      if (!localizacao) return;

      const apiKey = 'b3e1a9ab27f793b1c5ddfb23811f7ea1';
      const { latitude, longitude } = localizacao.coords;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pt_br`;

      const resposta = await fetch(url);
      const dados = await resposta.json();

      setClima(dados);
    }

    buscarClima();
  }, [localizacao]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App de Clima 🌤️</Text>

      {erro && <Text>{erro}</Text>}

      {clima && (
        <View style={styles.climaContainer}>
          <Text style={styles.cidade}>{clima.name}</Text>
          <Text style={styles.temperatura}>{Math.round(clima.main.temp)}°C</Text>
          <Text style={styles.descricao}>{clima.weather[0].description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  climaContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  cidade: {
    fontSize: 20,
    fontWeight: '600',
  },
  temperatura: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
});
