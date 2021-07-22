import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Droppable } from 'react-beautiful-dnd';
import {
  Flex,
  Box,
  Heading,
  Button,
  VStack,
  Badge,
  Collapse,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';
import Card from './Card';

export default function CardHolder({ id, title, color, holderCards }) {
  const { isOpen, onToggle } = useDisclosure();
  const { addCard } = useContext(AppContext);

  const [inputText, setInputText] = useState('');

  const handleTextArea = (e) => {
    setInputText(e.target.value);
  };

  const handleAddBtn = async (id) => {
    if (!isOpen) {
      onToggle();
    } else {
      if (inputText.trim() !== '') addCard(id, inputText);
      onToggle();
      setInputText('');
    }
  };

  return (
    <Box minWidth='180px'>
      <Flex
        background={color}
        h='40px'
        px={2}
        position='relative'
        overflow='hidden'
        alignItems='center'
        justifyContent='space-between'
      >
        <Heading as='h5' size='sm' color={'whiteAlpha.900'}>
          {title}
        </Heading>
        <Badge px={2.5} py={0.5} color='white' bgColor='whiteAlpha.300'>
          {holderCards?.length}
        </Badge>
      </Flex>

      <Flex direction='column' borderColor={color} borderWidth='2px'>
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <Box p={2} ref={provided.innerRef}>
              <VStack>
                {holderCards?.map((card, index) => (
                  <Card key={card.id} card={card} index={index} />
                ))}
              </VStack>
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
        <Collapse in={isOpen} animateOpacity>
          <Box color='purple.600' p={2}>
            <Textarea
              value={inputText}
              onChange={handleTextArea}
              placeholder='Input text for new cards ...'
            />
          </Box>
        </Collapse>
      </Flex>

      <Button
        mt={1}
        onClick={() => handleAddBtn(id)}
        size='xs'
        colorScheme='purple'
        variant='outline'
      >
        add
      </Button>
    </Box>
  );
}
