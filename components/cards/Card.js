import { Button, Box, Heading, Text } from '@chakra-ui/react';
import { Draggable } from 'react-beautiful-dnd';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Card({ card, index }) {
  const { deleteCard } = useContext(AppContext);

  return (
    <Box w='100%'>
      <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            p={3}
            position='relative'
            maxW='sm'
            bgColor='whiteAlpha.800'
            borderWidth='2px'
            borderRadius='sm'
            overflow='hidden'
          >
            <Button
              position='absolute'
              top='-3px'
              right='2px'
              mt={1}
              size='xs'
              fontSize='1.1rem'
              colorScheme='red'
              variant='ghost'
              onClick={() => deleteCard(card.id)}
            >
              x
            </Button>

            <Box isTruncated>
              <Heading as='h5' size='sm'>
                ID: {card.id}
              </Heading>
            </Box>

            <Box mt='1'>
              <Text color='gray.600'>{card.text}</Text>
            </Box>
          </Box>
        )}
      </Draggable>
    </Box>
  );
}
