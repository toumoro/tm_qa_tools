<?php

namespace Toumoro\TmQaTools\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Process\Process;

#[AsCommand(
    name: 'tmqatools:run',
    description: 'A command that runs all QA checks.'
)]
class RunTestsCommand extends Command
{
    private const COMMAND = './Build/Scripts/runTests.sh run:all';

    /**
     * Defines the allowed options for this command
     */
    protected function configure(): void
    {
        $this
            ->setDescription('Enter the command that you want to execute')
            ->addArgument(
                'execCmd',
                InputArgument::OPTIONAL,
                'Executable Command',
                self::COMMAND
            );
    }

    /**
     * @param InputInterface  $input
     * @param OutputInterface $output
     *
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Executing All QA Checks');

        $command = $input->getArgument('execCmd');

        $process = Process::fromShellCommandline($command);
        $process->run(function ($type, $buffer) use ($io) {
            $io->write($buffer);
        });

        if (!$process->isSuccessful()) {
            $io->error('QA script failed.');
            return Command::FAILURE;
        }

        $io->success('QA script completed successfully.');
        return Command::SUCCESS;
    }
}
