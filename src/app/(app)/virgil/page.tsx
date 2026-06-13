import { getIntegrationStatus } from "@/lib/integrations/status"
import { VirgilGuideClient } from "./virgil-guide-client"

export default function VirgilPage() {
  const { virgil } = getIntegrationStatus()

  return <VirgilGuideClient configured={virgil.configured} />
}
