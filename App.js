// How to Download an Image in React Native from any URL
// https://aboutreact.com/download-image-in-react-native/

// Import React
import React, {Component} from 'react'

// Import Required Components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native'

// Import RNFetchBlob for the file download
import RNFetchBlob from 'rn-fetch-blob'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  _download () {
    const {
      dirs: {DownloadDir, DocumentDir},
    } = RNFetchBlob.fs
    const {config} = RNFetchBlob
    const isIos = Platform.OS === 'ios'
    const aPath = Platform.select({ios: DocumentDir, android: DownloadDir})
    var image_URL =
      'https://www.freecodecamp.org/news/content/images/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png'
    var ext = 'png'
    var file_ex = 'image.png'

    const fPath = `${aPath}/${file_ex}`

    const configOption = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
        appendExt: ext,
      },

      android: {
        fileCache: true,
        appendExt: ext,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: aPath + '/' + file_ex,
          description: 'Image',
        },
      },
    })

    if (isIos) {
      this.setState({loading: true, progress: 0})
      RNFetchBlob.config(configOption)
        .fetch('GET', image_URL)
        .then(res => {
          console.log('file', res)
          this.setState({loading: false})

          RNFetchBlob.ios.previewDocument('file://' + res.path())
          Alert.alert('Image Downloaded Successfully.')
        })
      return
    } else {
      this.setState({loading: true})
      config(configOption)
        .fetch('GET', image_URL)
        .progress({count: 10}, (received, total) => {
          console.log('progress', received / total)
          this.setState({progress: received / total})
        })
        .then(res => {
          console.log('file_download', res)
          this.setState({loading: false, progress: 100})

          RNFetchBlob.android.actionViewIntent(res.path())
          Alert.alert('Image Downloaded Successfully.')
        })
        .catch((errorMessage, statusCode) => {
          this.setState({loading: false})
          console.log('error with download file', errorMessage)
        })
    }
  }
  render () {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            color='#F17F42'
            size='large'
            style={styles.activityIndicator}
          />
        </View>
      )
    }
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            textAlign: 'center',
            width: 180,
            fontSize: 20,
            marginTop: 80,
          }}>
          React Native Image File Download IOS & ANDROID
        </Text>
        <Text
          style={{
            color: '#E53A40',
            marginTop: 10,
            fontSize: 20,
            fontWeight: '700',
          }}>
          Image
          URL:'https://www.freecodecamp.org/news/content/images/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png'
        </Text>
        <Image
          source={{
            uri:
              'https://www.freecodecamp.org/news/content/images/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png',
          }}
          style={{height: 250, width: '70%', marginVertical: 10}}></Image>
        <TouchableOpacity
          style={{
            width: 200,
            height: 40,
            backgroundColor: '#f94e3f',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}
          onPress={() => this._download()}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FFF'}}>
            Download
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
})
