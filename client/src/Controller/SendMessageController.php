<?php

namespace App\Controller;

use App\Entity\Message;
use App\Form\MessageType;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SendMessageController extends AbstractController {

    #[Route('/send', name: 'send_message', methods: ['POST'])]
    public function send(Request $request): Response {

        $message = new Message();
        $data = json_decode($request->getContent(), true);

        $form = $this->createForm(MessageType::class, $message);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {

            return new Response(
                'Your message is: '. $message->getMessage()
            );
        }

        return new Response(
            'Please provide a message'
        );
    }
}