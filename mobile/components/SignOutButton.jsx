import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { styles } from '../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/colors'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()



  const onLogoutPress  = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {text: "Cancel", style: "cancel"},
      {text: "Logout", style: "destructive", onPress:  async () => await signOut() }
    ])
  }

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
      <Ionicons name='log-out-outline' size={22} color={COLORS.text} />
    </TouchableOpacity>
  )
}
