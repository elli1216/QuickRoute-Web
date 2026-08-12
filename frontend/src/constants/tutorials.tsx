import type { ReactNode } from 'react'

export type TutorialStep = {
  title: string
  description: ReactNode
  imageSrc: string
  imageAlt: string
}

export type Tutorial = {
  title: string
  steps: TutorialStep[]
}

export const TUTORIALS: Tutorial[] = [
  {
    title: 'Tutorial: How to Mock Your First API',
    steps: [
      {
        title: 'Define Route',
        description: (
          <>
            Head over to the <strong>Create Mock</strong> page. Select your HTTP method (e.g., <code>GET</code>, <code>POST</code>) and define the path (e.g., <code>/api/users</code>). You can also use path variables like <code>/api/users/:id</code>.
          </>
        ),
        imageSrc: '/steps/step1.png',
        imageAlt: 'Step 1: Define Route',
      },
      {
        title: 'Set Response',
        description: (
          <>
            Choose a status code and an optional delay (great for testing loading states). Then, use the Visual Field Builder or Raw JSON editor to craft exactly what the API should return.
          </>
        ),
        imageSrc: '/steps/step2.png',
        imageAlt: 'Step 2: Set Response',
      },
      {
        title: 'Call It!',
        description: (
          <>
            Hit <strong>Create Mock</strong>. You will receive a unique Mock ID and a base URL. Simply point your frontend application or curl commands to that URL, and you're done!
          </>
        ),
        imageSrc: '/steps/step3.png',
        imageAlt: 'Step 3: Call It!',
      },
    ],
  },
  {
    title: 'Tutorial: Building Arrays of Objects',
    steps: [
      {
        title: 'Add an Array Field',
        description: (
          <>
            Start by adding a new field to your response and set its type to <strong>Array</strong>. Give it a name, like <code>users</code>.
          </>
        ),
        imageSrc: '/steps/fields/step1.png',
        imageAlt: 'Step 1: Add Array Field',
      },
      {
        title: 'Add an Object Field',
        description: (
          <>
            Click the <strong>Add Field</strong> button <em>inside</em> the array to create a nested field. Change this new inner field's type to <strong>Object</strong>.
          </>
        ),
        imageSrc: '/steps/fields/step2.png',
        imageAlt: 'Step 2: Add Object Field',
      },
      {
        title: 'Add Fields Inside the Object',
        description: (
          <>
            Now, add fields inside that object to represent your data structure. For example, add <code>id</code> (Number) and <code>name</code> (String).
          </>
        ),
        imageSrc: '/steps/fields/step3.png',
        imageAlt: 'Step 3: Add Fields to Object',
      },
      {
        title: 'Generate Multiple Objects',
        description: (
          <>
            If you want to generate a list of items, locate the <strong>Generate</strong> button on your Array field. Input how many objects you want to generate and click it. The builder will automatically duplicate your object schema!
          </>
        ),
        imageSrc: '/steps/fields/step4.png',
        imageAlt: 'Step 4: Generate Objects',
      },
      {
        title: 'Preview Your JSON',
        description: (
          <>
            Click the <strong>Preview JSON</strong> accordion below the visual builder to see the exact structure that will be sent back when your mock is called.
          </>
        ),
        imageSrc: '/steps/fields/step5.png',
        imageAlt: 'Step 5: Preview JSON',
      },
    ],
  },
]
