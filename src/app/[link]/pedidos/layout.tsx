import Provider from '@/app/components/Provider'

export default function RootLayout({children, params }: {children: React.ReactNode, params: { link: string }}) {
  return (
      <Provider params={params}>
        {children}
      </Provider>
  )
}
